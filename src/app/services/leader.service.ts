import { Injectable } from '@angular/core';

import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';

import { delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';

import { ProcessHTTPMsgService } from './process-httpmsg.service';

import { Restangular } from 'ngx-restangular';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient,
  private processHTTPMsgService: ProcessHTTPMsgService,
  private restangular: Restangular) { }

  getLeaders(): Observable<Leader[]> {
    return this.restangular.all('leaders').getList();
  }

  getLeader(id: number): Observable<Leader> {
  	return this.restangular.one('leaders', id).get();
  }

  getFeaturedLeader(): Observable<Leader> {
  	return this.restangular.all('leaders').getList({featured: true})
      .pipe(map(leaders => leaders[0]));
  }
}
