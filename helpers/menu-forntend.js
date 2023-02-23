

const getMenuFrondEnd = (role = 'USER_ROLE')=>{
    const menu = [
      {
        title: 'Dashboard',
        icon: 'mdi mdi-gauge',
        submenu:[
          { title: 'Main', url: '/dashboard'},
          { title: 'ProgresBar', url: 'progress'},
          { title: 'Gráficas', url: 'grafica1'},
          { title: 'Promesas', url: 'promesas'},
          { title: 'RXJS', url: 'rxjs'},
        ]
      },
      {
        title: 'Mantenimiento',
        icon: 'mdi mdi-folder-lock-open',
        submenu:[
        //   { title: 'Usuarios', url: 'usuarios'},
          { title: 'Hospitales', url: 'hospitales'},
          { title: 'Médicos', url: 'medicos'},
        ]
      },
    ]; 

    if(role === 'ADMIN_ROLE' ){
        menu[1].submenu.push({ title: 'Usuarios', url: 'usuarios'})
    }

    return menu;
}

module.exports = {
    getMenuFrondEnd
}