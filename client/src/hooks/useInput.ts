import { ChangeEvent, EventHandler, useState } from "react"

type UseInputReturnType = [string, EventHandler<ChangeEvent<HTMLInputElement>>, () => void];

export default function useInput(initialState: string = ''): UseInputReturnType {
  const [value, setValue] = useState<string>(initialState);

  const onChange: EventHandler<ChangeEvent<HTMLInputElement>> = (e) => {
    setValue(e.target.value);
  }

  const clear = () => {
    setValue('');
  }

  return [value, onChange, clear];
}
