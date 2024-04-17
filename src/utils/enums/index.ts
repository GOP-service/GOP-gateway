// * Role
export enum RoleType  {
    CUSTOMER = "customer",
    DRIVER = "driver",
    RESTAURANT = "restaurant",
    ADMIN = "admin"
}

// * Account
export enum OTPVerifyStatus {
    OTP_WRONG = "WRONG OTP! PLEASE TRY AGAIN",
    OTP_EXPIRED = "OTP EXPIRED! PLEASE TRY AGAIN",
    SUCCESS = "SUCCESS"
}

export enum OTPType {
    VERIFY_ACCOUNT = "Verify your account",
    FORGOT_PASSWORD = "Change your account password",
    VERIFY_PARCEL = "Verify parcel",
}

// * Driver
export enum VehicleType {
    BIKE = "MOTORBIKE",
    CAR = "CAR"
}

export enum DriverStatus {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
    BUSY = "BUSY",
}

// * Restaurant
export enum RestaurantTier {
    STANDARD = "STANDARD",
    PREMIUM = "PREMIUM",
    DELUXE = "DELUXE"
}

export enum RestaurantStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED"
}

export enum CuisinesCategory {
    MILK_TEA = "MILK_TEA",
    DRINKS = "DRINKS",
    BANH_MI = "BANH_MI",
    FAST_FOOD = "FAST_FOOD",
    RICE = "RICE",
    NOODLES = "NOODLES",
    CAKE = "CAKE",
    VEGAN_FOODS = "VEGAN_FOODS",
    BBQ = "BBQ",
    THAI_FOOD = "THAI_FOOD",
    JAPANESE_FOOD = "JAPANESE_FOOD",
    KOREAN_FOOD = "KOREAN_FOOD",
    CHINESE_FOOD = "CHINESE_FOOD",
}

// * Order
export enum OrderStatus {
    ALLOCATING = "ALLOCATING",
    PENDING_PICKUP = "PENDING_PICKUP",
    PICKING_UP = "PICKING_UP",
    PENDING_DROP_OFF = "PENDING_DROP_OFF",
    DROPPING_OFF = "DROPPING_OFF",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    FAILED = "FAILED"
}



export enum OrderType {
    DELIVERY = "DeliveryOrder",
    TRANSPORT = "TransportOrder" 
}

export enum BillStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    CANCELLED = "CANCELLED"
}

export enum PaymentMethod {
    CASH = "CASH",
    CARD = "CARD"
}

export const BikeFare : DistanceFare = {
    First2Km : 4000,
    Next8Km : 3000,
    Over10Km : 2000
}

export const CarFare : DistanceFare = {
    First2Km : 7000,
    Next8Km : 5000,
    Over10Km : 4000
}

export type DistanceFare = {
    First2Km: number,
    Next8Km: number,
    Over10Km: number
}

// * 