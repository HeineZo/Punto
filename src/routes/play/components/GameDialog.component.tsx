import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  cancelBtn: {
    text: string;
    onClick: () => void;
  };
  confirmBtn: {
    text: string;
    onClick: () => void;
  };
};

/**
 * Affiche une popup pendant la partie
 * @param open Détermine si le popup doit être affiché
 * @param title Titre du popup
 * @param description? Description du popup
 * @param cancelBtn Bouton d'annulation
 * @param confirmBtn Bouton de confirmation
 */
export function GameDialog({
  open,
  title,
  description,
  cancelBtn,
  confirmBtn,
}: Props) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="flex flex-col items-center">
        <AlertDialogHeader>
          <h3>{title}</h3>
        </AlertDialogHeader>
        <AlertDialogDescription>{description}</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelBtn.onClick}>
            {cancelBtn.text}
          </AlertDialogCancel>
          <AlertDialogAction onClick={confirmBtn.onClick}>
            {confirmBtn.text}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
