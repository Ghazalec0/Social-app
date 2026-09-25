
import { AbstractRepository } from "../../abstract.repository";
import { IRequest } from '../../../common';
import { RequestModel } from './request.model'

export class RequestRepository extends AbstractRepository<IRequest> {
  constructor() {
    super(RequestModel)
  }
}

export const requestRepo = new RequestRepository();