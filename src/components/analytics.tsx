import { AnalyticsCard } from "./analytics-card";
import { DottedSeparator } from "./dotted-separator";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

interface AnalyticsProps {
  data?: {
    taskCount: number;
    taskDifference: number;
    assignedTaskCount: number;
    assignedTaskDifference: number;
    incompleteTaskCount: number;
    incompleteTaskDifference: number;
    projectCount?: number;
    projectDifference?: number;
    completedTaskCount: number;
    completedTaskDifference: number;
    overdueTaskCount: number;
    overdueTaskDifference: number;
  };
}

export const Analytics = ({ data }: AnalyticsProps) => {
  if (!data) return null;
  return (
    <ScrollArea className="border rounded-lg w-full shrink-0 whitespace-nowrap">
      <div className="w-full flex flex-row gap-x-3">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Total Tasks"
            value={data.taskCount}
            variant={data.taskDifference > 0 ? "up" : "down"}
            increaseValue={data.taskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Assigned Tasks"
            value={data.assignedTaskCount}
            variant={data.assignedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.assignedTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Completed Tasks"
            value={data.completedTaskCount}
            variant={data.completedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.completedTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="InCompleted Task"
            value={data.incompleteTaskCount}
            variant={data.incompleteTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.incompleteTaskDifference}
          />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Over Due Tasks"
            value={data.overdueTaskCount}
            variant={data.overdueTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.overdueTaskDifference}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
