/**
 * OpenAPI definition
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */ /* tslint:disable:no-unused-variable member-ordering */

import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';

import { Observable } from 'rxjs';

import { Configuration } from '../../configuration';
import { CustomHttpUrlEncodingCodec } from '../../encoder';
import { BASE_PATH } from '../../variables';
import { UserInfo } from '../model/userInfo';

@Injectable()
export class AuthControllerService {
  protected basePath = 'http://localhost:8090';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Inject(Configuration) @Optional() configuration: Configuration
  ) {
    if (basePath) {
      this.basePath = basePath;
    }
    if (configuration) {
      this.configuration = configuration;
      this.basePath = basePath || configuration.basePath || this.basePath;
    }
  }

  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  private canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    for (const consume of consumes) {
      if (form === consume) {
        return true;
      }
    }
    return false;
  }

  /**
   *
   *
   * @param email
   * @param password
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public signIn(
    email: string,
    password: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<string>;
  public signIn(
    email: string,
    password: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<string>>;
  public signIn(
    email: string,
    password: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<string>>;
  public signIn(
    email: string,
    password: string,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (email === null || email === undefined) {
      throw new Error(
        'Required parameter email was null or undefined when calling signIn.'
      );
    }

    if (password === null || password === undefined) {
      throw new Error(
        'Required parameter password was null or undefined when calling signIn.'
      );
    }

    let queryParameters = new HttpParams({
      encoder: new CustomHttpUrlEncodingCodec(),
    });
    if (email !== undefined && email !== null) {
      queryParameters = queryParameters.set('email', <any>email);
    }
    if (password !== undefined && password !== null) {
      queryParameters = queryParameters.set('password', <any>password);
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['text/plain', '*/*'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<string>(
      'post',
      `${this.basePath}/auth/sign-in`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        responseType: 'text' as 'json',
        reportProgress: reportProgress,
      }
    );
  }

  /**
   *
   *
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public signUp(
    body: UserInfo,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<string>;
  public signUp(
    body: UserInfo,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<string>>;
  public signUp(
    body: UserInfo,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<string>>;
  public signUp(
    body: UserInfo,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling signUp.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['text/plain', '*/*'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined =
      this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.request<string>(
      'post',
      `${this.basePath}/auth/sign-up`,
      {
        body: body,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        responseType: 'text' as 'json',
        reportProgress: reportProgress,
      }
    );
  }
}
