import assert from 'assert';
import { Order } from '@commercetools/platform-sdk';
import supertest from 'supertest';
import { CommercetoolsMock } from '../index';

describe('Order Query', () => {
  const ctMock = new CommercetoolsMock();
  const app = ctMock.createApp();
  let order: Order | undefined;

  beforeEach(async () => {
    let response = await supertest(app)
      .post('/dummy/carts')
      .send({
        currency: 'EUR',
      });
    expect(response.status).toBe(200);
    const cart = response.body;

    response = await supertest(app)
      .post('/dummy/orders')
      .send({
        cart: {
          typeId: 'cart',
          id: cart.id,
        },
      });
    expect(response.status).toBe(200);
    order = response.body;
  });

  test('no filter', async () => {
    assert(order);

    const response = await supertest(app).get(`/dummy/orders`);
    expect(response.status).toBe(200);
    expect(response.body.count).toBe(1);
    expect(response.body.total).toBe(1);
    expect(response.body.offset).toBe(0);
    expect(response.body.limit).toBe(20);
  });
});

describe('Order Update Actions', () => {
  const ctMock = new CommercetoolsMock();
  const app = ctMock.createApp();
  let order: Order | undefined;

  beforeEach(async () => {
    let response = await supertest(app)
      .post('/dummy/carts')
      .send({
        currency: 'EUR',
      });
    expect(response.status).toBe(200);
    const cart = response.body;

    response = await supertest(app)
      .post('/dummy/orders')
      .send({
        cart: {
          typeId: 'cart',
          id: cart.id,
        },
      });
    expect(response.status).toBe(200);
    order = response.body;
  });

  test('no update', async () => {
    assert(order);

    const response = await supertest(app)
      .post(`/dummy/orders/${order.id}`)
      .send({
        version: 1,
        actions: [{ action: 'setLocale', locale: 'nl-NL' }],
      });
    expect(response.status).toBe(200);
    expect(response.body.version).toBe(2);
    expect(response.body.locale).toBe('nl-NL');

    const responseAgain = await supertest(app)
      .post(`/dummy/orders/${order.id}`)
      .send({
        version: 2,
        actions: [{ action: 'setLocale', locale: 'nl-NL' }],
      });
    expect(responseAgain.status).toBe(200);
    expect(responseAgain.body.version).toBe(2);
    expect(responseAgain.body.locale).toBe('nl-NL');
  });

  test('setOrderNumber', async () => {
    assert(order);

    const response = await supertest(app)
      .post(`/dummy/orders/${order.id}`)
      .send({
        version: 1,
        actions: [{ action: 'setOrderNumber', orderNumber: '5000123' }],
      });
    expect(response.status).toBe(200);
    expect(response.body.version).toBe(2);
    expect(response.body.orderNumber).toBe('5000123');
  });

  test('changeOrderState', async () => {
    assert(order);

    const response = await supertest(app)
      .post(`/dummy/orders/${order.id}`)
      .send({
        version: 1,
        actions: [{ action: 'changeOrderState', orderState: 'Complete' }],
      });
    expect(response.status).toBe(200);
    expect(response.body.version).toBe(2);
    expect(response.body.orderState).toBe('Complete');
  });

  test('changePaymentState | changeOrderState', async () => {
    assert(order);

    const response = await supertest(app)
      .post(`/dummy/orders/${order.id}`)
      .send({
        version: 1,
        actions: [
          { action: 'changeOrderState', orderState: 'Cancelled' },
          { action: 'changePaymentState', paymentState: 'Failed' },
        ],
      });
    expect(response.status).toBe(200);
    expect(response.body.version).toBe(2);
    expect(response.body.orderState).toBe('Cancelled');
    expect(response.body.paymentState).toBe('Failed');
  });
});

describe('Order Import', () => {
  const ctMock = new CommercetoolsMock();
  const app = ctMock.createApp();

  test('Import', async () => {
    const response = await supertest(app)
      .post(`/dummy/orders/import`)
      .send({
        orderNumber: '100000001',
        totalPrice: {
          centAmount: 1000,
          currencyCode: 'EUR',
        },
        lineItems: [
          {
            id: '15fc56ba-a74e-4cf8-b4b0-bada5c101541',
            productId: 'PRODUCTID',
            name: {
              'en-US': 'The product',
            },
            productType: {
              typeId: 'product-type',
              id: '109caecb-abe6-4900-ab03-7af5af985ff3',
              // @ts-ignore
              version: 1,
            },
            variant: {
              id: 1,
              sku: 'MYSKU',
              key: 'MYKEY',
              prices: [
                {
                  value: {
                    type: 'centPrecision',
                    currencyCode: 'EUR',
                    centAmount: 14900,
                    fractionDigits: 2,
                  },
                  id: '87943be5-c7e6-44eb-b867-f127f94ccfe7',
                  country: 'NL',
                  // channel: {
                  //   typeId: 'channel',
                  //   id: '411485eb-7875-46f4-8d40-1db9e61374ed',
                  // },
                  // custom: {
                  //   type: {
                  //     typeId: 'type',
                  //     id: '55071385-b6e4-44c4-8c4b-6f2ec0f23649',
                  //   },
                  //   fields: {},
                  // },
                },
              ],
              images: [],
              attributes: [],
              assets: [],
            },
            price: {
              value: {
                type: 'centPrecision',
                currencyCode: 'EUR',
                centAmount: 14900,
                fractionDigits: 2,
              },
              id: '87943be5-c7e6-44eb-b867-f127f94ccfe7',
              country: 'NL',
              // channel: {
              //   typeId: 'channel',
              //   id: '411485eb-7875-46f4-8d40-1db9e61374ed',
              // },
              // custom: {
              //   type: {
              //     typeId: 'type',
              //     id: '55071385-b6e4-44c4-8c4b-6f2ec0f23649',
              //   },
              //   fields: {},
              // },
            },
            quantity: 3,
            discountedPricePerQuantity: [],
            // distributionChannel: {
            //   typeId: 'channel',
            //   id: '411485eb-7875-46f4-8d40-1db9e61374ed',
            // },
            taxRate: {
              name: '21% BTW',
              amount: 0.21,
              includedInPrice: true,
              country: 'NL',
              id: 'Z0wLUuYw',
              subRates: [],
            },
            addedAt: '2020-12-08T09:10:27.085Z',
            lastModifiedAt: '2020-12-08T09:10:27.085Z',
            // state: [
            //   {
            //     quantity: 3,
            //     state: {
            //       typeId: 'state',
            //       id: 'f1d9531d-41f0-46a7-82f2-c4b0748aa9f5',
            //     },
            //   },
            // ],
            priceMode: 'Platform',
            totalPrice: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 44700,
              fractionDigits: 2,
            },
            taxedPrice: {
              totalNet: {
                type: 'centPrecision',
                currencyCode: 'EUR',
                centAmount: 36942,
                fractionDigits: 2,
              },
              totalGross: {
                type: 'centPrecision',
                currencyCode: 'EUR',
                centAmount: 44700,
                fractionDigits: 2,
              },
            },
            lineItemMode: 'Standard',
          },
        ],
      });

    expect(response.status).toBe(200);

    const created: Order = response.body;
    expect(created.lineItems).toHaveLength(1);
  });
});