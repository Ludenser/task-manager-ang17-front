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
import { ErrorResponse } from '../model/errorResponse';
import { MembersRequest } from '../model/membersRequest';
import { MembersResponse } from '../model/membersResponse';
import { Task } from '../model/task';
import { TaskRecord } from '../model/taskRecord';

@Injectable()
export class TaskControllerService {
  protected basePath = 'http://localhost:8089';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() @Inject(Configuration) configuration: Configuration
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
   * @param body
   * @param taskId
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public assignTask(
    body: MembersRequest,
    taskId: number,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<Array<ErrorResponse>>;
  public assignTask(
    body: MembersRequest,
    taskId: number,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<ErrorResponse>>>;
  public assignTask(
    body: MembersRequest,
    taskId: number,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<ErrorResponse>>>;
  public assignTask(
    body: MembersRequest,
    taskId: number,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling assignTask.'
      );
    }

    if (taskId === null || taskId === undefined) {
      throw new Error(
        'Required parameter taskId was null or undefined when calling assignTask.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*'];
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

    return this.httpClient.request<Array<ErrorResponse>>(
      'post',
      `${this.basePath}/tasks/${encodeURIComponent(String(taskId))}/assign`,
      {
        body: body,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
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
  public createTask(
    body: TaskRecord,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<Task>;
  public createTask(
    body: TaskRecord,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<Task>>;
  public createTask(
    body: TaskRecord,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<Task>>;
  public createTask(
    body: TaskRecord,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling createTask.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*'];
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

    return this.httpClient.request<Task>(
      'post',
      `${this.basePath}/tasks/task`,
      {
        body: body,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   *
   *
   * @param taskId
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public deleteTask(
    taskId: number,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public deleteTask(
    taskId: number,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public deleteTask(
    taskId: number,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public deleteTask(
    taskId: number,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (taskId === null || taskId === undefined) {
      throw new Error(
        'Required parameter taskId was null or undefined when calling deleteTask.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<any>(
      'delete',
      `${this.basePath}/tasks/${encodeURIComponent(String(taskId))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   *
   *
   * @param taskId
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getAllMembersInTask(
    taskId: number,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<Array<MembersResponse>>;
  public getAllMembersInTask(
    taskId: number,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<MembersResponse>>>;
  public getAllMembersInTask(
    taskId: number,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<MembersResponse>>>;
  public getAllMembersInTask(
    taskId: number,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (taskId === null || taskId === undefined) {
      throw new Error(
        'Required parameter taskId was null or undefined when calling getAllMembersInTask.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<Array<MembersResponse>>(
      'get',
      `${this.basePath}/tasks/${encodeURIComponent(String(taskId))}/members`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   *
   *
   * @param timeStart
   * @param timeEnd
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getAllTaskBetweenTime(
    timeStart: string,
    timeEnd: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<Array<TaskRecord>>;
  public getAllTaskBetweenTime(
    timeStart: string,
    timeEnd: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<TaskRecord>>>;
  public getAllTaskBetweenTime(
    timeStart: string,
    timeEnd: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<TaskRecord>>>;
  public getAllTaskBetweenTime(
    timeStart: string,
    timeEnd: string,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (timeStart === null || timeStart === undefined) {
      throw new Error(
        'Required parameter timeStart was null or undefined when calling getAllTaskBetweenTime.'
      );
    }

    if (timeEnd === null || timeEnd === undefined) {
      throw new Error(
        'Required parameter timeEnd was null or undefined when calling getAllTaskBetweenTime.'
      );
    }

    let queryParameters = new HttpParams({
      encoder: new CustomHttpUrlEncodingCodec(),
    });
    if (timeStart !== undefined && timeStart !== null) {
      queryParameters = queryParameters.set('timeStart', <any>timeStart);
    }
    if (timeEnd !== undefined && timeEnd !== null) {
      queryParameters = queryParameters.set('timeEnd', <any>timeEnd);
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<Array<TaskRecord>>(
      'get',
      `${this.basePath}/tasks/betweenTime`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   *
   *
   * @param taskId
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getTaskById(
    taskId: number,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<TaskRecord>;
  public getTaskById(
    taskId: number,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<TaskRecord>>;
  public getTaskById(
    taskId: number,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<TaskRecord>>;
  public getTaskById(
    taskId: number,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (taskId === null || taskId === undefined) {
      throw new Error(
        'Required parameter taskId was null or undefined when calling getTaskById.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<TaskRecord>(
      'get',
      `${this.basePath}/tasks/${encodeURIComponent(String(taskId))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   *
   *
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getTaskCritical(
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<Array<string>>;
  public getTaskCritical(
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<string>>>;
  public getTaskCritical(
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<string>>>;
  public getTaskCritical(
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<Array<string>>(
      'get',
      `${this.basePath}/tasks/critical`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   *
   *
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getTaskStatus(
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<Array<string>>;
  public getTaskStatus(
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<string>>>;
  public getTaskStatus(
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<string>>>;
  public getTaskStatus(
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<Array<string>>(
      'get',
      `${this.basePath}/tasks/status`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   *
   *
   * @param body
   * @param taskId
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public updateTask(
    body: TaskRecord,
    taskId: number,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<Task>;
  public updateTask(
    body: TaskRecord,
    taskId: number,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<Task>>;
  public updateTask(
    body: TaskRecord,
    taskId: number,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<Task>>;
  public updateTask(
    body: TaskRecord,
    taskId: number,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling updateTask.'
      );
    }

    if (taskId === null || taskId === undefined) {
      throw new Error(
        'Required parameter taskId was null or undefined when calling updateTask.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*'];
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

    return this.httpClient.request<Task>(
      'put',
      `${this.basePath}/tasks/${encodeURIComponent(String(taskId))}`,
      {
        body: body,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }
}