import { useCallback, useEffect, useState } from "react";
import { Person } from "../models/Person";

interface FormatedData {
  formatted: any[];
  search: (search: string) => Promise<void>;
  sortBy: (search: string) => Promise<void>;
  filter: (data: any) => Promise<void>;
}

const useFormattedData = (data: Person[]): FormatedData => {
  const [formatted, setFormatted] = useState<Person[]>(data);
  const [functionQueue, setFunctionQueue] = useState<Function[]>([]);
  useEffect(() => {
    if (functionQueue.length > 0) {
      const fn = functionQueue[0];
      fn(formatted).then((res: Person[]) => {
        setFunctionQueue((prev) => prev.slice(1));
        setFormatted(res);
      });
    }
  }, [functionQueue]);

  const addSearchToQueue = (search: string) => {
    setFunctionQueue((prev) => [
      ...prev,
      (items: Person[]) => searchData(search, items),
    ]);
  };

  const addFilterToQueue = (filterFunction: (item: any) => boolean) => {
    setFunctionQueue((prev) => [...prev, (items: Person[]) => filterData(filterFunction, items)]);
  };

  const addSortToQueue = (sortBy: string) => {
    setFunctionQueue((prev) => [
      ...prev,
      (items: Person[]) => sortData(sortBy, items),
    ]);
  };

  /**
   * Filters the data based on the provided string and sets the updated state of filteredData.
   *
   * @param {string} search - the search string.
   * @returns {void}
   */
  const searchData = useCallback(
    (search: string, dataToFormat: Person[]): Promise<Person[]> => {
      const filteredData = dataToFormat.filter((person) =>
        Object.values(person).some((value) =>
          value.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
      return Promise.resolve(filteredData);
    },
    [formatted]
  );

  /**
   * Sorts the data based on the provided string (name of property) and sets the updated state of filteredData.
   *
   * @param {string} sortBy - the key name from the model.
   * @returns {void}
   */
  const sortData = useCallback(
    (sortBy: string, dataToFormat: Person[]): Promise<Person[]> => {
      console.log("formatted data 2", formatted);
      if (!(sortBy in data[0])) {
        // Handle the case when sortBy is not a valid key in Person model.
      }
      const sortedData = dataToFormat.sort((a, b) => {
        if (a[sortBy as keyof Person] < b[sortBy as keyof Person]) {
          return -1;
        }
        if (a[sortBy as keyof Person] > b[sortBy as keyof Person]) {
          return 1;
        }
        return 0;
      });
      return Promise.resolve(sortedData);
    },
    [formatted]
  );

  /**
   * Filters the data based on the provided filter function and sets the updated state of formatted data.
   *
   * @param {filterFunction} filterFunction - the filter function to apply on each item.
   * @returns {void}
   */
  const filterData = useCallback(
    (filterFunction: (item: any) => boolean, dataToFormat: Person[]): Promise<Person[]> => {
      console.log("formatted data 3", formatted);
      const filteredData = dataToFormat.filter(filterFunction);
      return Promise.resolve(filteredData);
    },
    [formatted]
  );

  return {
    formatted,
    search: addSearchToQueue,
    sortBy: addSortToQueue,
    filter: addFilterToQueue,
  } as FormatedData;
};

export default useFormattedData;
