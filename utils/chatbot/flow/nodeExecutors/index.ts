import { buttonExecutor } from "./button.executor";
import { listExecutor } from "./list.executor";
import { questionExecutor } from "./question.executor";
import { sendMessageExecutor } from "./sendMessage.executor";

export const executors = {
  send_message: sendMessageExecutor,
  button: buttonExecutor,
  list: listExecutor,
  question: questionExecutor,
};
