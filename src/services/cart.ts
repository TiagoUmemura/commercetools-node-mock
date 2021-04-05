import AbstractService from './abstract';
import { Request, Response, Router } from 'express';
import { CartDraft } from '@commercetools/platform-sdk';
import { CartRepository } from '../repositories/cart';
import { AbstractStorage } from '../storage';

export class CartService extends AbstractService {
  public repository: CartRepository;

  constructor(parent: Router, storage: AbstractStorage) {
    super(parent);
    this.repository = new CartRepository(storage);
  }

  getBasePath() {
    return 'carts';
  }

  post(request: Request, response: Response) {
    const draft: CartDraft = request.body;
    const resource = this.repository.create(draft);
    return response.status(200).send(resource);
  }
}