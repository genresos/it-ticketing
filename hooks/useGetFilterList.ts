import { useEffect, useState } from "react";

interface DataList {
  text: string;
  value: string | number;
}

const useGetFilterList = (
  data: any[],
  keyIndicator: string,
  allValue?: string
) => {
  const [filterList, setFilterList] = useState<DataList[]>([]);

  useEffect(() => {
    const getFilterList = () => {
      const val: DataList[] = allValue ? [{ text: allValue, value: "" }] : [];
      const sorted = data.map((item) => item[keyIndicator]).sort();
      sorted.map((sortItm) => {
        const findVal = val.some((someItm) => someItm.value === sortItm);
        if (!findVal) {
          val.push({
            text: sortItm,
            value: sortItm,
          });
        }
        return sortItm;
      });

      return val;
    };

    setFilterList(getFilterList());
  }, [data, keyIndicator, allValue]);

  return filterList;
};

export default useGetFilterList;
