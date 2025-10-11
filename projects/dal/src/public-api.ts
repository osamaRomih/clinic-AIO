/*
 * Public API Surface of dal
 */

export * from './lib/dal.service';
export * from './lib/dal.component';

// admin services
export {TimeslotService} from './services/admin/timeslot.service'
export {AuthService} from './services/admin/auth.service'
export {InitService} from './services/admin/init.service'

// patient services


// secretary services




// admin interfaces
export {ITimeSlot} from './models/timeslot'
export {ILoginRequest} from './models/login-request'
export {ILoginResponse} from './models/login-response'
export {IUser} from './models/user'


// interceptors

export {authInterceptor} from './interceptors/auth.interceptor'
export {errorInterceptor} from './interceptors/error.interceptor'
export {loaderInterceptor} from './interceptors/loader.interceptor'