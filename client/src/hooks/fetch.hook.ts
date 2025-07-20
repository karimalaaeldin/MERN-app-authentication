import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from "../helper/api";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;

interface UserData {
  _id: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  address?: string;
  username: string;
  email: string;
  profile: string;
  __v: number;
}

interface FetchState {
  isLoading: boolean;
  apiData: UserData | null;
  status: number | null;
  serverError: Error | null;
}

export default function useFetch(
  query?: string
): [FetchState, React.Dispatch<React.SetStateAction<FetchState>>] {
  const [getData, setData] = useState<FetchState>({
    isLoading: false,
    apiData: null,
    status: null,
    serverError: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData((prev) => ({ ...prev, isLoading: true }));
        let username = "";

        if (!query) {
          const data = await getUsername();
          username = (data as { username: string }).username;
        }

        const response = !query
          ? await axios.get(`/api/user/${username}`)
          : await axios.get(`/api/${query}`);

        if (response.status === 201 || response.status === 200) {
          setData((prev) => ({
            ...prev,
            isLoading: false,
          }));
          setData((prev) => ({
            ...prev,
            apiData: response.data,
            status: response.status,
          }));
        }

        setData((prev) => ({
          ...prev,
          isLoading: false,
        }));
      } catch (error) {
        setData((prev) => ({
          ...prev,
          isLoading: false,
          serverError: error as Error,
        }));
      }
    };

    fetchData();
  }, [query]);

  return [getData, setData];
}
