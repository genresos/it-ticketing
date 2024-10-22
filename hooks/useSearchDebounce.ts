import { useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";

const useSearchDebounce = (value: string, delay: number) => {
  const [search, setSearch] = useState("");

  const handleSetSearch = useRef(
    debounce((val: string) => setSearch(val), delay)
  ).current;

  useEffect(() => {
    handleSetSearch(value);
  }, [handleSetSearch, value]);

  return { dataSearch: search };
};

export default useSearchDebounce;
