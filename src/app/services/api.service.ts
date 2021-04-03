import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';

import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  baseUrl = `${environment.baseUrl}:1337`;

  constructor(
    private http: HttpClient,
  ) { }

  formatCountryList(countries){
    return countries.map(function (item) {
      return {
        id: item.dial_code,
        text: item.name,
        additional: {
          flagUrl: item.flag
        }
      }
    })

  }
  formatCurrencyList(currency){
    return currency.map(function (item) {
      return {
        id: item.symbol,
        text: item.code,
      }
    })

  }
  formatCategoryList(category) {
    return category.map(function (item) {
      return {
        id: item.id,
        text: item.name,
      }
    })
  }

  formatLanguageList(language) {
    return language.map(function (item) {
      return {
        id: item,
        text: item
      }
    })
  }
  checkEmail(email) {
    return this.http.post(`${this.baseUrl}/api/checkEmail`, { email: email })
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  verifyEmail(email) {
    return this.http.post(`${this.baseUrl}/api/verifyEmail`, { email: email })
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  sendOTP(email) {
    return this.http.post(`${this.baseUrl}/api/otp`, { email: email })
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  verifyOTP(data) {
    return this.http.post(`${this.baseUrl}/api/verifyOTP`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  changePassword(data) {
    return this.http.post(`${this.baseUrl}/api/change`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  linkedInlogin(code) {
    return this.http.post(`${this.baseUrl}/api/linkedinAuth`, { authCode: code })
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getcountrycode() {
    return this.http.get(`assets/js/country_codes.json`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }
  getCurrencyCode() {
    return this.http.get(`assets/js/currency.json`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getCategory() {
    return this.http.get(`${this.baseUrl}/api/showCategories`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getSubCategory(ids) {
    return this.http.get(`${this.baseUrl}/api/showSubCategories?categoryIds=${ids}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  addSubCategory(data) {
    return this.http.post(`${this.baseUrl}/api/createSubcat`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  addCategory(data) {
    return this.http.post(`${this.baseUrl}/api/createCategory`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  updateProfile(data) {
    return this.http.post(`${this.baseUrl}/api/updateProfile`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getUserProfile(id) {
    return this.http.get(`${this.baseUrl}/api/getUserProfile?userId=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  emergencyContact(data: any) {
    return this.http.post(`${this.baseUrl}/api/createEmergencyContact`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getEmergencyContact(id: string) {
    return this.http.get(`${this.baseUrl}/api/getEmergencyContact?userId=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  updateEmergencyContact(data: any) {
    return this.http.put(`${this.baseUrl}/api/updateEmergencyContact`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  deleteEmergencyContact(id: string) {
    console.log(id)
    return this.http.delete(`${this.baseUrl}/api/deleteEmergencyContact?EmergencyInformationId=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  businessInformation(data) {
    return this.http.post(`${this.baseUrl}/api/businessInformation`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getbusinessInformation(id) {
    return this.http.get(`${this.baseUrl}/api/getBusinessInformation?userId=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  registerAsServiceProvider(data) {
    return this.http.post(`${this.baseUrl}/api/registerAsServiceProvider`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  createComments(data) {
    return this.http.post(`${this.baseUrl}/api/createComments`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  deleteService(data) {
    return this.http.put(`${this.baseUrl}/api/delete_service`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getUserComments(id) {
    return this.http.get(`${this.baseUrl}/api/getUserComments?serviceId=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getService(id) {
    return this.http.get(`${this.baseUrl}/api/getServiceById?id=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getUsersService(id) {
    return this.http.get(`${this.baseUrl}/api/getServiceByUserId?userId=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getAllServiceByCategory(data) {
    return this.http.get(`${this.baseUrl}/api/getAllServicesByCategoryId?categoryId=${data.catId}&cityName=${data.cityName}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getRecentServices(data) {
    return this.http.get(`${this.baseUrl}/api/getLastFourServices?cityName=${data.cityName}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getAllService(data) {
    return this.http.get(`${this.baseUrl}/api/getAllServices?cityName=${data.cityName}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  createOrder(data) {
    return this.http.post(`${this.baseUrl}/api/createOrder`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getOrder(id) {
    return this.http.get(`${this.baseUrl}/api/getOrderById?id=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getAllOrder(data) {
    return this.http.get(`${this.baseUrl}/api/getAllOrdersByUserId?userId=${data.id}&page_num=${data.page_num}&skips=${data.skips}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  saveService(data) {
    return this.http.post(`${this.baseUrl}/api/saveServices`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getSavedServices(id) {
    return this.http.get(`${this.baseUrl}/api/getSavedServicesByUserId?userId=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getListOfSavedServicesByUserId(id) {
    return this.http.get(`${this.baseUrl}/api/getListOfSavedServicesByUserId?userId=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getSavedServicesByService(id) {
    return this.http.get(`${this.baseUrl}/api/getSaveServicesByServiceId?serviceId=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  deleteSaveServices(id) {
    return this.http.delete(`${this.baseUrl}/api/deleteSaveServices?id=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getlanguage(language) {
    return this.http.get(`assets/language/${language}.json`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  search(data: any) {
    return this.http.get(`${this.baseUrl}/api/searchServices?keyWords=${data.keyWords}&cityName=${data.cityName}&jobSatisfaction=${data.jobSatisfaction}&rating=${data.rating}&numberOfJobs=${data.numberOfJobs}&employeeType=${data.employeeType}&englishLevel=${data.englishLevel}&lastActive=${data.lastActive}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  filter(jobSatisfaction, rate, jobs) {
    return this.http.get(`${this.baseUrl}/api/filteredServices?jobSatisfaction=${jobSatisfaction}&rating=${rate}&numberOfJobs=${jobs}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  createMessage(data) {
    return this.http.post(`${this.baseUrl}/api/createMessage`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getMessage(data) {
    return this.http.get(`${this.baseUrl}/api/getMessages?channelId=${data.id}&page_num=${data.page_num}&skips=${data.skips}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getRecentUsers(data: any) {
    return this.http.get(`${this.baseUrl}/api/get_users_profiles?userId=${data.userId}&userChatId=${data.userChatId}&providerChatId=${data.providerChatId}&page_num=${data.page_num}&skips=${data.skips}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getTopCategories() {
    return this.http.get(`${this.baseUrl}/api/getTopCategories`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  createChannel(data) {
    return this.http.post(`${this.baseUrl}/api/join_user`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  deleteChannel(id) {
    return this.http.delete(`${this.baseUrl}/api/remove_recent_chat_user?channelId=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getAddress(id) {
    return this.http.get(`${this.baseUrl}/api/getUserAddresses?userId=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  createAddress(data) {
    return this.http.post(`${this.baseUrl}/api/createUserAddresses`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  updateAddress(data) {
    return this.http.put(`${this.baseUrl}/api/updateUserAddresses`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  deleteAddress(id) {
    return this.http.delete(`${this.baseUrl}/api/deleteUserAddresses?addressId=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getClientToken() {
    return this.http.get(`${this.baseUrl}/api/getClientToken`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  checkout(data) {
    return this.http.post(`${this.baseUrl}/api/checkout`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  markAsRead(data) {
    return this.http.put(`${this.baseUrl}/api/messages_read_and_unread`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  setOrderAsArchive(data) {
    return this.http.put(`${this.baseUrl}/api/setOrderAsArchive`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  createTimeSlots(data: any) {
    return this.http.post(`${this.baseUrl}/api/create_time_slot`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  checkTimeSlots(data: any) {
    return this.http.get(`${this.baseUrl}/api/checkTimeSlots?serviceId=${data.serviceId}&slotDate=${data.date}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getTimeSlots(id: string) {
    return this.http.get(`${this.baseUrl}/api/getTimeSlotsByServiceId?serviceId=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  updateTimeSlots(data: any) {
    return this.http.put(`${this.baseUrl}/api/updateTimeSlots`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  updateSlotsByService(data: any) {
    return this.http.put(`${this.baseUrl}/api/updateSlots`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  deleteTimeSlots(id: string) {
    return this.http.delete(`${this.baseUrl}/api/deleteTimeSlots?timeSlotId=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getServiceListings(data: any) {
    return this.http.get(`${this.baseUrl}/api/getServiceListings?userId=${data.id}&page_num=${data.page_num}&skips=${data.skips}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  searchListedServices(data: any) {
    return this.http.get(`${this.baseUrl}/api/searchListedServices?userId=${data.id}&keyWords=${data.keyWords}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  progressStats(id: string) {
    return this.http.get(`${this.baseUrl}/api/progressStats?user=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  serviceViewsAndBookings(id: string) {
    return this.http.get(`${this.baseUrl}/api/serviceViewsAndBookingsEarning?user=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  serviceEarning(id: string) {
    return this.http.get(`${this.baseUrl}/api/serviceEarning?user=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  updateServiceViews(data: any) {
    return this.http.post(`${this.baseUrl}/api/updateServiceViews`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  orderAcceptOrReject(data: any) {
    return this.http.put(`${this.baseUrl}/api/order_accept_reject`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  rescheduleAppointment(data: any) {
    return this.http.put(`${this.baseUrl}/api/reschedule_appointment`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  orderComplete(data: any) {
    return this.http.put(`${this.baseUrl}/api/orderComplete`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getListOfOrderIdByUserId(id: string) {
    return this.http.get(`${this.baseUrl}/api/getListOfOrderIdByUserId?userId=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getComplaintByUserId(data: any) {
    return this.http.get(`${this.baseUrl}/api/complaintsByUserId?user=${data.id}&page_num=${data.page_num}&skips=${data.skips}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  createComplaint(data: any) {
    return this.http.post(`${this.baseUrl}/api/complaints`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  createComplaintReply(data: any) {
    return this.http.post(`${this.baseUrl}/api/complaints_reply`, data)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getListOfCategorySubCategory() {
    return this.http.get(`${this.baseUrl}/api/list_category_subcategory`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  getUserIsActiveOrInactive(id) {
    return this.http.get(`${this.baseUrl}/api/user_active_or_inactive?user=${id}`)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }

  imageUpload(data) {
    let form = new FormData();

    form.append('userId', data.id);
    form.append('profile', data.files)

    return this.http.post(`${this.baseUrl}/api/updateUserImage`, form)
      .pipe(map((res: any) => res),
        catchError(error => throwError(error.error || 'Server Error')));
  }
}
