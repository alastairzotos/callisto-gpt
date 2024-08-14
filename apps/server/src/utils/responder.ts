import { Response } from "@bitmetro/callisto";
import { Subject } from "rxjs";

export class ChatResponder {
  private subject = new Subject<{ event: 'message', data: Response }>();

  asObservable() {
    return this.subject.asObservable();
  }

  sendText(text: string) {
    this.subject.next({ event: 'message', data: { type: 'text', data: text } });
  }

  sendThreadId(threadId: string) {
    this.subject.next({ event: 'message', data: { type: 'thread-id', data: threadId } });
  }

  sendStop() {
    this.subject.next({ event: 'message', data: { type: 'stop' } });
  }
}
