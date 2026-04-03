export type createReviewPayload = {
    bookingId:string
    studentId:string
    tutorId:string
    rating:number
    comment:string
}
export type Review = {
    id:string
    bookingId:string
    studentId:string
    tutorId:string
    rating:number
    comment:string
    createdAt:string
}