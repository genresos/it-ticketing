import { OptionBase } from "chakra-react-select";

export type MutateParams<T = unknown> = T & {
  token: string;
};

export type MutateParamsId<T = unknown> = T & {
  id: number;
  token: string;
};

type Links = {
  url: string | null;
  label: string;
  active: boolean;
};

export type Pagination<T = unknown> = T & {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Links[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

export interface ListSelect extends OptionBase {
  label: string;
  value: string;
  additional?: string;
}
