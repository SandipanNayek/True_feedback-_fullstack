import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {toast} from "sonner"
import { Button } from "@/components/ui/button";
import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";
type MesageCardProps = {
    message:Message;
    onMessageDelete: (messageId: string) => void
}

function MessageCard({message , onMessageDelete}: MesageCardProps) {
    const handleDeleteConfirm = async () => {
    const response =   await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
    toast.success(response.data.message)
     onMessageDelete(message._id.toString());
    }
  return (
    <Card className="w-full max-w-md rounded-xl shadow-md transition-shadow hover:shadow-lg">
      <CardHeader className="flex items-start justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">
            Anonymous Message
          </CardTitle>

        </div>

        <CardAction>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="destructive" size="sm" />
              }
            >
              Delete
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete this message?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  This action cannot be undone. The message will be permanently
                  removed.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </CardHeader>

      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">
            {message.content}
        </p>
      </CardContent>

      <CardFooter className="justify-end border-t pt-4">
        <p className="text-xs text-muted-foreground">
            {new Date(message.createdAt).toLocaleString()}
        </p>
      </CardFooter>
    </Card>
  );
}

export default MessageCard;