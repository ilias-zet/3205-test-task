import express from 'express';
import pool from './db';
import 'dotenv/config';
import { cleanupMiddleware } from './middleware/cleanupMiddleware';
import { generateUrl } from './utils';

const app = express();
app.use(express.json());
app.use(cleanupMiddleware);

const PORT = 3005;

const getClickCount = async (linkId: string): Promise<number> => {
   const { rows } = await pool.query('SELECT count(*) FROM stats WHERE link_id = $1', [linkId]);
   return rows[0].count;
}

app.get('/', async (_, res) => {
   try {
      const data = await pool.query('SELECT * FROM links');
      res.status(200).send(data.rows);
   } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error");
   }
});

app.post('/shorten', async (req, res) => {
   const { originalUrl, expiresAt } = req.body;
   const id = generateUrl();

   try {
      await pool.query(`
         INSERT INTO links (id, original_url, expires_at)
         VALUES ($1, $2, COALESCE($3, CURRENT_TIMESTAMP + interval '7 days'))
      `, [id, originalUrl, expiresAt]);
      res.status(200).send("Success");
   } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error");
   }
});

app.get('/info/:linkId', async (req, res) => {
   const { linkId } = req.params;
   if (!linkId) {
      return res.status(400).send('"linkId" parameter is required');
   }
   
   try {
      const linkData = await pool.query(`
         SELECT original_url AS "originalUrl", created_at AS "createdAt" FROM links 
         WHERE id = $1
      `, [linkId]);
      const clickCount = await getClickCount(linkId);
      const linkInfo = linkData.rows[0];

      if (!linkInfo) {
         return res.status(404).send();
      }
      res.status(200).send({
         ...linkInfo,
         clickCount,
      });
   } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error");
   }
});

app.get('/analytics/:linkId', async (req, res) => {
   const { linkId } = req.params;
   if (!linkId) {
      return res.status(400).send('"linkId" parameter is required');
   }

   try {
      const lastClickedData = await pool.query(`
         SELECT ip FROM stats WHERE link_id = $1 
         ORDER BY date DESC
         LIMIT 5
      `, [linkId]);
      const clickCount = await getClickCount(linkId);
      const lastClickedBy = lastClickedData.rows.map(({ ip }) => ip);

      res.status(200).send({
         lastClickedBy,
         clickCount,
      });

   } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error");
   }
});

app.delete('/delete/:linkId', async (req, res) => {
   const { linkId } = req.params;
   if (!linkId) {
      return res.status(400).send('"linkId" parameter is required');
   }

   try {
      await pool.query('DELETE FROM links WHERE id = $1', [linkId]);
      res.status(200).send();
   } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error");
   }
});

app.get('/:linkId', async (req, res) => {
   const { linkId } = req.params;
   const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
   
   try {
      const data = await pool.query('SELECT * FROM links WHERE id = $1', [linkId]);
      const link = data.rows[0];
      if (!link) {
         return res.status(404).send();
      }
      await pool.query('INSERT INTO stats (link_id, ip) VALUES ($1, $2)', [linkId, ip]);
      res.redirect(link.original_url);
   } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error");
   }
});

app.listen(PORT, () => {
   console.log(`Server listening on port ${PORT}`);
});
