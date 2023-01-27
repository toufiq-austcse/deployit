import { Test, TestingModule } from '@nestjs/testing';
import { ApiModule } from '../../src/api/api.module';
import request from 'supertest';
import * as assert from 'assert';
import { after, before, binding, then, when } from 'cucumber-tsflow';
import { INestApplication } from '@nestjs/common';

// let statusCode: number;
// When('I send GET request to {string}', { timeout: 2 * 5000 }, async function(string) {
//   const moduleFixture: TestingModule = await Test.createTestingModule({
//     imports: [ApiModule]
//   }).compile();
//   let app = moduleFixture.createNestApplication();
//   await app.init();
//   let getReq = await request(app.getHttpServer()).get(string);
//   statusCode = getReq.status;
// });
//
// Then('I should get a {int} response code', function(code) {
//   // Then('I should get a {float} response code', function (float) {
//   // Write code here that turns the phrase above into concrete actions
//   assert.deepEqual(statusCode, code);
// });

@binding()
export class HealthCheckSteps {
  private app: INestApplication;
  private statusCode: number;

  @after()
  public async after(): Promise<void> {
    return null;
  }

  @before()
  public async before() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiModule]
    }).compile();
    this.app = moduleFixture.createNestApplication();
    await this.app.init();
  }

  @when('I send GET request to {string}', 'endpoint', 2 * 5000)
  public async makeHealthCheckReq(endpoint: string) {
    let getReq = await request(this.app.getHttpServer()).get(endpoint);
    this.statusCode = getReq.status;
  }

  @then('I should get a {int} response code')
  public async checkHealthCheckReqStatusCode(code: number) {
    assert.deepEqual(code, this.statusCode);
  }
}