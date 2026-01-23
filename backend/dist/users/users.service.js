"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("./users.repository");
const auth_service_1 = require("../auth/auth.service");
let UsersService = class UsersService {
    constructor(usersRepository, authService) {
        this.usersRepository = usersRepository;
        this.authService = authService;
    }
    async findAll() {
        const users = await this.usersRepository.findAll();
        return users.map((user) => this.toResponseDto(user));
    }
    async findById(id) {
        const user = await this.usersRepository.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.toResponseDto(user);
    }
    async create(createUserDto) {
        const hashedPassword = await this.authService.hashPassword(createUserDto.password);
        const user = await this.usersRepository.create(Object.assign(Object.assign({}, createUserDto), { password: hashedPassword }));
        return this.toResponseDto(user);
    }
    async update(id, updateUserDto) {
        const user = await this.usersRepository.update(id, updateUserDto);
        return this.toResponseDto(user);
    }
    toResponseDto(user) {
        const { password } = user, result = __rest(user, ["password"]);
        return result;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        auth_service_1.AuthService])
], UsersService);
//# sourceMappingURL=users.service.js.map