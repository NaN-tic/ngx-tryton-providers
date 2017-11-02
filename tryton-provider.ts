import { Injectable } from '@angular/core';
import { SessionService } from '../ngx-tryton';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

/**
 * Generated class for the TrytonProvider provider.
 *
 * This injectable is responsible to communicate with the tryton server
 * it implements the search() and write() methods.
 *
*/

// DO NOT MODIFY THIS FILE, EXTEND THE CLASS INSTEAD

@Injectable()
export class TrytonProvider {
  /**
   * Initialize tryton session
   * @param {SessionService} public tryton_session Injector for RPC calls
   */

  constructor(public tryton_session: SessionService) {
    console.log('Starting provider, setting up request');
  }
  /**
   * Searchs in tryton the given values in JSON format
   * @param {JSON} json JSON with the information to searchs, it requires
   *                    the model, domain and fields to look for.
   *                    More info about the format of the JSON please look
   *                    at the encode-json-read.ts file
   */

  public search(json) {
    console.log('Started search request for ', json);
    return this.tryton_session.rpc('model.app.proxy.app_search', [json])
      .map(res => { return JSON.parse(res) })
      .catch(this._handle_error);
  }
  /**
   * Creates or updates new records in tryton
   * @param {JSON} json JSON with the values to create/update
   *                    For more info please look at encode-json-write.ts
   */
  public write(json) {
    console.log('Started write request for ', json);
    return this.tryton_session.rpc('model.app.proxy.app_write', [json])
      .map(res => {
        console.log("got response", res)
        if (res != 'AK')
          return JSON.parse(res);
        return res
      })
      .catch(this._handle_error);
  }

  public rpc_call(method, data) {
    console.log("Started RPC call to ", method, " with data: ", data)
    return this.tryton_session.rpc(method, data)
      .map(res => {
        console.log("Received response")
        return res
      })
      .catch(this._handle_error);
  }

  /**
   * Handles errors
   * @param {Observable} error Error ocurred
   */
  private _handle_error(error) {
    console.log("Error encountered", error);
    return Observable.throw(error)
  }
}
