'use client';
import React, { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Cliente' | 'Editor';
  status: 'Activo' | 'Inactivo';
  avatar: string;
  registrationDate: string;
}

const users: User[] = [
  {
    id: '1',
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@ejemplo.com',
    role: 'Administrador',
    status: 'Activo',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1Vyng3zNSYZiuoGIW9qFw_Kux6XqZwzw0IaAgh1bP7UNBmWL12FfXo-ivNYAtw43NAtQZfVDmxEW6iUVIq4vK_iogQ0lAdAUNU0XIl8bMPLoJ39P_bWBWId1oiKpxjer0NnFau2BDqNjrcmjz2My0xxoEEtikL8eG0IsQk8Tw-pwSz7lVICNhrO_23pbtB17wu0sNv77dgUN12PHu2pIfUGuBMFlw_CZbw4LeUSQp-QbVSl1IFRpm99kG5So3337fJ1FtpVFf9_Gf',
    registrationDate: '12 Oct, 2023',
  },
  {
    id: '2',
    name: 'Ana Lopez',
    email: 'ana.lopez@store.com',
    role: 'Cliente',
    status: 'Activo',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEFdMqv6SDMi-1N0SD2ys8iD3_Oy5rP93MKEbjLveqHdpMt559_ZRroOwOgMGBSXZwahk_-A5N8FlCEhuLD_rYsTe9q1AzoZ9fQqV2z0QEtmLPAhlei-yFgKTVxuHZT9uMHF8EIQalEaGOl36wx50mY_lmdVjzdzR8geJnYH-S-rcd5MvMbvNMrNbNJoyTXXyKqvN_Plwnjyx8FVkX5Qyiv0ctdRLVaf4QgxEiHmOep1HA-B6KVXLtzZwVooxl8gCrI4vb1d7Buwpv',
    registrationDate: '05 Nov, 2023',
  },
  {
    id: '3',
    name: 'Miguel Angel',
    email: 'm.angel@design.com',
    role: 'Editor',
    status: 'Inactivo',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBs-lLdSUCJLwIFOsS7Q3YpL4fGUZ7YIUE1cfNj-vcyKculcEuVpevyMXiLrYDOzJzuALckdHDLvpoRKMI-G6ScfRXsXUiXxaTs7EzKhjyOtEgzJj_Z4WnxvQGe6RiJ6-awsYRcLuRUDs9bD_5UywC0Apun_YFgaJZth2-w_voyGm2Ur7Dg6peB44jE7ZeR2WlEfv9LrumLgtTz4ecfeEdq1GQSotgw_WT4ywYmRvSc9OTvkUzRwup1yPPP1zAdE943u4J4K8aADWf',
    registrationDate: '20 Sep, 2023',
  },
  {
    id: '4',
    name: 'Sara Conner',
    email: 'sara.c@skynet.com',
    role: 'Cliente',
    status: 'Activo',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGaHsY29tqOSuzIESYfjKbZRITHOIIa2C_eRGcNS0G9X6bv9nK6ZzKFOEHrbjSs5P2GvpfCyRlz4IOO-2mci2-1DYvnxUWhUoakvpR9ah9CvfvK9esxpq8uT-YXehNhB8vl12JTZeIQ0dmTrBNAqyEXCmlsA_uI45JhjgoqVBxRMpplHHUzge_YnIfRRXbb0hYSyxEqz_fDi9TPuK2_ZZr8cw8Q58w21I97GfMc9oYFjqQVL3Ul1qhlDhAGU_-rEFTQj7rqtLrDopr',
    registrationDate: '01 Dec, 2023',
  },
];

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Administrador':
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    case 'Cliente':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    case 'Editor':
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800';
    default:
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';
  }
};

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('Todos los roles');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalUsers = 24;

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'Todos los roles' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleEdit = (userId: string) => {
    console.log('Edit user:', userId);
  };

  const handleDelete = (userId: string) => {
    console.log('Delete user:', userId);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            Gestión de Usuarios
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Administra los miembros de tu tienda y sus permisos.
          </p>
        </div>
        <button className="bg-echo-blue dark:bg-primary hover:bg-echo-blue-variant dark:hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 font-medium">
          <span className="material-icons-outlined text-sm">add</span>
          Nuevo Usuario
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-surface-dark rounded-t-xl p-4 border border-gray-200 dark:border-gray-700 border-b-0 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full md:w-96">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <span className="material-icons-outlined text-xl">search</span>
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent dark:text-gray-200 dark:placeholder-gray-500 transition-shadow"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="appearance-none w-full md:w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2.5 pl-4 pr-10 rounded-lg text-sm focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent cursor-pointer"
            >
              <option>Todos los roles</option>
              <option>Administrador</option>
              <option>Cliente</option>
              <option>Editor</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <span className="material-icons-outlined text-sm">expand_more</span>
            </span>
          </div>
          <button className="p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-800 transition-colors">
            <span className="material-icons-outlined text-xl block">filter_list</span>
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-b-xl shadow-sm overflow-hidden hidden md:block">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Fecha de Registro</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      alt={user.name}
                      src={user.avatar}
                      className={`w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 ${
                        user.status === 'Inactivo' ? 'grayscale' : ''
                      }`}
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        user.status === 'Activo' ? 'bg-emerald-500' : 'bg-gray-400'
                      }`}
                    ></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {user.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {user.registrationDate}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(user.id)}
                    className="text-gray-400 hover:text-echo-blue dark:hover:text-primary transition-colors p-1"
                  >
                    <span className="material-icons-outlined text-lg">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 ml-2"
                  >
                    <span className="material-icons-outlined text-lg">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-surface-dark">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando{' '}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {currentPage === 1 ? 1 : (currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalUsers)}
            </span>{' '}
            de <span className="font-medium text-gray-900 dark:text-gray-100">{totalUsers}</span>{' '}
            usuarios
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage * itemsPerPage >= totalUsers}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  alt={user.name}
                  src={user.avatar}
                  className={`w-12 h-12 rounded-full object-cover ${
                    user.status === 'Inactivo' ? 'grayscale' : ''
                  }`}
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
              <button className="text-gray-400">
                <span className="material-icons-outlined">more_vert</span>
              </button>
            </div>
            {user.status === 'Inactivo' && (
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span> Inactivo
                </span>
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                  user.role
                )}`}
              >
                {user.role}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(user.id)}
                  className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg"
                >
                  <span className="material-icons-outlined text-sm">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg"
                >
                  <span className="material-icons-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;

