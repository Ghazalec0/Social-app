import { AbstractRepository } from "../../abstract.repository";
import { IMessage } from "../../../common/interfaces/message.interface";
import { Message } from "./message.model";

export class MessageRepository extends AbstractRepository<IMessage> {
    constructor() {
        super(Message);
    }

    async deleteMany(filter: any) {
        return await this.model.deleteMany(filter);
    }

    async deleteOne(filter: any) {
        return await this.model.deleteOne(filter);
    }
    // شيلنا updateOne لانه موجود جاهز في AbstractRepository
}

export const messageRepo = new MessageRepository();