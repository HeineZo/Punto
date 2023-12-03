import { TooltipProvider, TooltipTrigger, Tooltip, TooltipContent } from "../ui/tooltip";

type Props = {
  children: JSX.Element|JSX.Element[];
  text: string;
}

/**
 * Affiche un texte d'aide au survol d'un élément
 * @param children Élément à afficher
 * @param text Texte à afficher au survol 
 */
export default function Help({children, text}: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
