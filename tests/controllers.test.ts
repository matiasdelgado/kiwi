import { suite, test } from "mocha-typescript";
import { assert } from 'chai';
import { IKiwiOptions, createKiwiServer, processRequest } from '../src/index';
import { TestController } from '../samples/test-controller';
import { TestController2 } from '../samples/test-controller2';
import { TestController3 } from '../samples/test-controller3';
import { TestMiddleware2 } from '../samples/test-middlware2';
import { TestMiddleware } from '../samples/test-middlware';
import { KiwiMetadataStorage } from '../src/metadata/metadataStorage';
var httpMocks = require('node-mocks-http');

const options: IKiwiOptions = {
    controllers: [TestController, TestController2, TestController3],
    authorization: null,
    middlewares: [TestMiddleware2, TestMiddleware],
    cors: {
        enabled: true
    },
    documentation: {
        enabled: true,
        path: '/apidoc'
    },
    log: true,
    port: 8086,
    prefix: '/v1'
}

@suite class ControllersSuite {
    static before() {
        KiwiMetadataStorage.init(options);
    }

    before() {

    }

    @test async 'It must return the param 1'() {
        const param = 'pepe';
        var request = httpMocks.createRequest({
            method: 'GET',
            url: `/v1/testcontroller/testinguy/${param}`
        });

        var response = httpMocks.createResponse();
        await processRequest(request, response);
        var data = JSON.parse(response._getData());
        assert.equal(response.statusCode, 200);
        assert.equal(data.name, param);
    }

    @test async 'It must return 404 http error'() {
        var request = httpMocks.createRequest({
            method: 'GET',
            url: '/v1/testcontroller/queryparadsdm/1'
        });

        var response = httpMocks.createResponse();
        await processRequest(request, response);
        var data = response._getData();
        assert.equal(response.statusCode, 404);
        assert.equal(data, 'Method doesnt match');
    }

    @test async 'It must create an object with query params values as properies'() {
        var request = httpMocks.createRequest({
            method: 'GET',
            url: '/v1/testcontroller/queryparam/1?name=guille'
        });

        var response = httpMocks.createResponse();
        await processRequest(request, response);
        var data = JSON.parse(response._getData());
        assert.equal(response.statusCode, 200);
        assert.equal(data.name, 'guille');
    }

    @test async 'It must add two header params'() { 
        const h1 = 'header1';
        const h2 = 'header2';
        var request = httpMocks.createRequest({
            method: 'GET',
            url: '/v1/testcontroller/testHeaders',
            headers: {
                h1: h1,
                h2: h2
            }
        });

        var response = httpMocks.createResponse();
        await processRequest(request, response);
        var data = JSON.parse(response._getData());
        assert.equal(response.statusCode, 200);
        assert.equal(data.h1, h1);
        assert.equal(data.h2, h2);
    }

    static after() {

    }

    after() {

    }
}