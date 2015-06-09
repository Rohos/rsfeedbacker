# rsfeedbacker
Простой Jquery плагин для отправки данных html формы. Работает асинхронно без перезагрузки и производит простую проверку, которая дополняется проверкой на сервере. На данный момент в плагине присутствует 2 типа поведения - "default" и "bootstrap". 

### Версия
0.0.1

### Установка (default)
* Подключаем Jquery последней версии
* Подключаем файл плагина "jquery.rsfeedbacker.js"
* Вешаем плагин на форму

```
$('form.form_for_send').rsFeedbacker();
```
 
### Установка (bootstrap)
* Подключаем bootstrap.css
* Подключаем Jquery последней версии
* Подключаем bootstrap.js
* Подключаем файл плагина "jquery.rsfeedbacker.js"
* Вешаем плагин на форму

```
$('form.form_for_send').rsFeedbacker({'type': 'bootstrap'});
```
 
### Настройки
- boxCls - класс контейнера формы (string, по умолч. "form_box")
- bootstrapBoxCls - класс контейнер для полей формы (string, по умолч. "form-group")
- errorBoxCls - класс контейнера ошибок (string, по умолч. "errors_box")
- errorCls - класс ошибок (string, по умолч. "has-error")
- type - тип поведения плагина (string, по умолч. "defaul", еще есть "bootstrap")
- need
- successMsg - текст сообщения при успешной отправке (string, по умолч. "Спасибо, сообщение успешно отправлено")
- errorMsgs - текст сообщения ошибки (object, по умолч. {'default': 'Поле {{%field%}} обязательно для заполнения'})
    
### Использование
Плагин вешается на форму. Для типа "default" форма должна быть вложена в родительский контейнер с классом указанном в настройке "boxCls":
```
<div class="form_box">
    <form action="/send.php" method="POST" class="form_for_send">
    ...
    </form>
</div>

<script type="text/javascript">
    $('form.form_for_send').rsFeedbacker();
</script>
```
### Валидация
На данный момент используется простая валидация, проверяющая задано ли обязательное значение или нет. Для этого используются аттрибуты html:
- Обязательное поле которое будет проверяться на пустоту
```
<input type="text" name="name" required="required">
```
- Не обязательное поле, его можно не заполнять
```
<input type="text" name="phone">
```
Текст ошибки задается в настройке "errorMsgs" по умолчаю это объект:
```
{'default': 'Поле {{%field%}} обязательно для заполнения'}
```
Паттерн "{{%field%}}" - будет заменен на название поля формы которое указывается в атрибуте поля "data-rsfeedbacker-label" или пустой строкой если не задан:
```
<input type="text" name="name" required="required" data-rsfeedbacker-label="Ваше имя">
```
Так же чтобы предотвратить отправку пробелов вместо значения по умолчанию используется очистка от пробелов, её можно отключить указав в настройке "needTrimVal" - значение false:
```
$('form.form_for_send').rsFeedbacker({'needTrimVal': false});
```