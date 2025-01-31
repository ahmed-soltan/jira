import { useQueryState, parseAsJson } from "nuqs";
import { TaskStatus } from "../types";

type OpenType = {
  isOpen: boolean;
  initialStatus?: TaskStatus;
};

type CreateTaskState = {
  isOpen: boolean;
  initialStatus?: TaskStatus;
};

export const useCreateTaskModel = () => {
  const [data, setData] = useQueryState<CreateTaskState>(
    "create-task",
    parseAsJson<CreateTaskState>().withDefault({ isOpen: false })
  );

  const open = ({ isOpen, initialStatus }: OpenType) =>
    setData({ isOpen, initialStatus });

  const close = () => setData({ isOpen: false });

  return {
    data,
    open,
    close,
    setData,
  };
};
