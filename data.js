function getUser() {
  var obj = {};
  var email = getUserEmail();
  if (email === "anonymous") {
    obj = {
      "role": "anonymous"
    };
  } else {
    let allUsers = getDataJsonFromFile(router.idFolderDB, router.userJsonData).users;
    obj.role = (typeof allUsers[email] !== "undefined") ? allUsers[email].role : "notwork";
    //obj.role = allUsers[email].role;
    obj.email = email;
    //obj.email = "infoteh@vu.cdu.edu.ua";
    // obj.email = "iim@vu.cdu.edu.ua";
    obj.proFunctional = usersSetup.permissionRevokeSignature; //true; // дозвіл на відкликання підпису
    switch (obj.role) {
      case "admin":
      case "admin_aisevlist":
        // obj.role = "secretary";
        obj.role = "teacher";
        break;
      case "teacher":
        obj.role = "teacher";
        break;
      case "secretary_directorate":
        obj.role = "secretary";
        break;
      default:
        obj.role = "anonymous"; //notwork !!! ЗМІНИТИ НА ВІКНО: У ВАС НЕ ДОСТАТЬО ПРАВ ДЛЯ ВИКОРИСТАННЯ ДАНОГО РЕСУРСУ
    }
  }
  return obj;
}

function getDataFromRouterLists() {
  // const elementId = "handBook";
  // const cache = CacheService.getScriptCache();
  // // let handBook = {};
  // // const cached = cache.get(elementId); //отримуємо запис про ресурс з кешу

  // if (cached != null) {
  // if (false) {
  //   handBook = JSON.parse(cached);
  //  console.log('Дані з кешу');
  // } else {
  //   handBook = getDataJsonFromFile(router.idFolderDB, router.nameJsonData);
  //   // log(handBook);
  //   // cache.put(elementId, JSON.stringify(handBook)); //кешуємо об'єкти ресурсів
  //   console.log('Дані з файлу');
  // }
  return getDataJsonFromFile(router.idFolderDB, router.nameJsonData); // handBook
}