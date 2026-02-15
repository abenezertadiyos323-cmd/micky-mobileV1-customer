export const ADMIN_QUERY_DEBUG_EVENT = "admin-query-debug";

export type QueryArgsType = "object" | "string";

export type QueryDebugDetail = {
  hook: string;
  query: string;
  adminTokenPresent: boolean;
  queryArgsType: QueryArgsType;
};

type QueryDebugInput = {
  hook: string;
  query: string;
  adminTokenPresent: boolean;
  args: unknown;
};

const getQueryArgsType = (args: unknown): QueryArgsType => {
  return typeof args === "string" ? "string" : "object";
};

export const logQueryDebug = ({
  hook,
  query,
  adminTokenPresent,
  args,
}: QueryDebugInput): void => {
  const detail: QueryDebugDetail = {
    hook,
    query,
    adminTokenPresent,
    queryArgsType: getQueryArgsType(args),
  };

  console.log("[AdminApp][QueryDebug]", detail);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<QueryDebugDetail>(ADMIN_QUERY_DEBUG_EVENT, { detail }));
  }
};
