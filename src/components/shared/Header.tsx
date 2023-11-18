import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

type Props = {
  title: string;
  children?: JSX.Element | JSX.Element[];
};

export default function Header({ title, children }: Props) {
  return (
    <span className="flex items-center gap-5">
      <Button asChild variant="outline">
        <Link to="..">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <h1>{title}</h1>
      {children}
    </span>
  );
}
