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
    FORGOT_PASSWORD = "Change your account password"
}

// * Driver
export enum VehicleType {
    BIKE = "MOTORBIKE",
    CAR = "CAR"
}

export enum DriverStatus {
    AVAILABLE = "AVAILABLE",
    UNAVAILABLE = "UNAVAILABLE"
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
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    PICKED_UP = "PICKED_UP",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

export enum OrderType {
    DELIVERY = "DELIVERY",
    TRANSPORT = "TRANSPORT" 
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

// * 