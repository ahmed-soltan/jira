import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Button variant={"primary"}>Hello world</Button>
      <Button variant={"destructive"}>Hello world</Button>
      <Button variant={"outline"}>Hello world</Button>
      <Button variant={"secondary"}>Hello world</Button>
      <Button variant={"ghost"}>Hello world</Button>
      <Button variant={"muted"}>Hello world</Button>
      <Button variant={"tertiary"}>Hello world</Button>
    </div>
  );
}
