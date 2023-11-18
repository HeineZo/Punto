import { Github, MessagesSquare } from "lucide-react";
import { Button } from "../ui/button";

export default function Footer() {
  return (
    <footer className="flex justify-center">
      <div className="bg-white rounded-lg shadow m-4 dark:bg-gray-800 w-full max-w-screen-lg p-4 flex flex-wrap items-center justify-between gap-6">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2023 • {""}
          <a href="https://heinezo.github.io" className="hover:underline">
            Développé par Enzo Morvan
          </a>
        </span>
        <ul className="flex flex-wrap items-center text-gray-500 dark:text-gray-400 gap-4">
          <li>
            <Button asChild variant="outline" size="icon">
              <a
                href=" https://discordapp.com/users/295133253096964097"
                target="_blank"
              >
                <MessagesSquare className="w-5 h-5" />
              </a>
            </Button>
          </li>
          <li>
            <Button asChild variant="outline" size="icon">
              <a href="https://github.com/heinezo" target="_blank">
                <Github className="w-5 h-5" />
              </a>
            </Button>
          </li>
        </ul>
      </div>
    </footer>
  );
}
