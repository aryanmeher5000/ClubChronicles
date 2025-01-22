import { useEffect } from "react";
import { UseFormReset } from "react-hook-form";

export function ResetForm(
  data: any,
  reset: UseFormReset<{
    [x: string]: any;
  }>
) {
  const keyArray: string[] = ["logo", "pdf", "profilePic", "images", "images"];

  useEffect(() => {
    if (data?.body) {
      const filteredData = Object.entries(data.body).filter(([key]) => !keyArray.includes(key));
      reset(Object.fromEntries(filteredData));
    }
  }, [data, reset]);
}
