/*
 * Public API Surface of dal
 */

export * from './lib/dal.service';
export * from './lib/dal.component';

// admin services
export {TimeslotService} from './services/admin/timeslot.service'
export {AuthService} from './services/admin/auth.service'
export {InitService} from './services/admin/init.service'
export {PrescriptionService} from './services/admin/prescription.service'
export {ProfileService} from './services/admin/profile.service'
export {UserService} from './services/admin/user.service'
export {RoleService} from './services/admin/role.service'


// patient services


// secretary services




// admin interfaces
export {ITimeSlot} from './models/timeslot'
export {WeeklyScheduleResponse} from './models/timeslot'
export {DaySlotsResponse} from './models/timeslot'
export {TimeSlotResponse} from './models/timeslot'
export {IPrescription,IPrescriptionItem} from './models/prescription'
export {IPrescriptionResponse} from './models/prescription'
export {IUserResponse} from './models/user-response'
export {IRoleResponse} from './models/role-response'
export {Menu} from './models/menu'


export {ILoginRequest} from './models/login-request'
export {ILoginResponse} from './models/login-response'
export {IUser} from './models/user'


// interceptors

export {authInterceptor} from './interceptors/auth.interceptor'
export {errorInterceptor} from './interceptors/error.interceptor'
export {loaderInterceptor} from './interceptors/loader.interceptor'




