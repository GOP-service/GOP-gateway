export enum RoleType  {
    CUSTOMER = "customer",
    DRIVER = "driver",
    RESTAURANT = "restaurant",
    ADMIN = "admin"
}

export enum VehicleType {
    BIKE = "MOTORBIKE",
    CAR = "CAR"
}

export enum DriverStatus {
    AVAILABLE = "AVAILABLE",
    UNAVAILABLE = "UNAVAILABLE"
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