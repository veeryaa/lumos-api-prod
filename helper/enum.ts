export enum SUCCESS_MESSAGE {
  CREATE = 'Data berhasil dibuat',
  READ_ID = 'Pengambilan data berdasarkan id berhasil.',
  READ_ALL = 'Pengambilan seluruh data berhasil.',
  UPDATE = 'Data berhasil diupdate.',
}

export enum FAIL_MESSAGE {
  READ_ID = 'Data yang dicari tidak ditemukan.',
  READ_ALL = 'Pengambil seluruh data gagal.',
  UPDATE = 'Data tidak dapat diupdate.',
}

export enum EMPLOYEE_ROLE {
  OWNER = 'OWNER',
  STAFF = 'STAFF',
}