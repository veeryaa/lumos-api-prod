"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPLOYEE_ROLE = exports.FAIL_MESSAGE = exports.SUCCESS_MESSAGE = void 0;
var SUCCESS_MESSAGE;
(function (SUCCESS_MESSAGE) {
    SUCCESS_MESSAGE["CREATE"] = "Data berhasil dibuat";
    SUCCESS_MESSAGE["READ_ID"] = "Pengambilan data berdasarkan id berhasil.";
    SUCCESS_MESSAGE["READ_ALL"] = "Pengambilan seluruh data berhasil.";
    SUCCESS_MESSAGE["UPDATE"] = "Data berhasil diupdate.";
})(SUCCESS_MESSAGE = exports.SUCCESS_MESSAGE || (exports.SUCCESS_MESSAGE = {}));
var FAIL_MESSAGE;
(function (FAIL_MESSAGE) {
    FAIL_MESSAGE["READ_ID"] = "Data yang dicari tidak ditemukan.";
    FAIL_MESSAGE["READ_ALL"] = "Pengambil seluruh data gagal.";
    FAIL_MESSAGE["UPDATE"] = "Data tidak dapat diupdate.";
})(FAIL_MESSAGE = exports.FAIL_MESSAGE || (exports.FAIL_MESSAGE = {}));
var EMPLOYEE_ROLE;
(function (EMPLOYEE_ROLE) {
    EMPLOYEE_ROLE["OWNER"] = "OWNER";
    EMPLOYEE_ROLE["STAFF"] = "STAFF";
})(EMPLOYEE_ROLE = exports.EMPLOYEE_ROLE || (exports.EMPLOYEE_ROLE = {}));
