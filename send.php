<?
// Проверка что отправлено методом POST иначе останавливаем скрипт
if (strtoupper($_SERVER['REQUEST_METHOD']) != 'POST')
{
    die('Ошибка!!!');
}

// Паттерн названия поля в тексте ошибок
define('FLD_LBL_PATTERN', '{{%field%}}');

// Данные для ответа
$data = array('errors' => array());

// Заголовок письма
$subject = 'Письмо обратной связи';

// E-mail для получения письма
$email = 'Test@test.ru';

// Дефолтный текст ошибки
$default_error_msg = 'Некорректное значение поля "'. FLD_LBL_PATTERN .'"';

/**
 * Правила для полей формы
 * required - обязательно ли поле (boolean) true или false ОБЯЗАТЕЛЬНО
 * rule - правило обработки значения (integer) константы php ОБЯЗАТЕЛЬНО
 * label - название поля формы ОБЯЗАТЕЛЬНО
 * error_msg - текст ошибки FLD_LBL_PATTERN - сюда подставится переменная label
 */
$fields = array(
    'name' => array(
        'required' => true,
        'rule' => FILTER_SANITIZE_STRING,
        'label' => 'Имя',
        'error_msg' => 'Вы не заполнили поле "'. FLD_LBL_PATTERN .'"'
    ),
    'email' => array(
        'required' => true,
        'rule' => FILTER_SANITIZE_EMAIL,
        'label' => 'E-mail',
        'error_msg' => 'Некорректное значение поля "'. FLD_LBL_PATTERN .'"'
    ),
    'email' => array(
        'required' => false,
        'rule' => FILTER_SANITIZE_STRING,
        'label' => 'Телефон',
        'error_msg' => 'Вы не заполнили поле "'. FLD_LBL_PATTERN .'"'
    )
);

$body = '';
$count = count($fields);
// Проверяем данные формы и формируем письмо
foreach ($fields as $field => $item)
{
    $val = filter_input(INPUT_POST, $field, $item['rule']);

    // Если поле обязательное и не заполнено или заполено некоректно - добавляем ошибку
    if ( ! empty($item['required']) && empty($val))
    {
        // Если не задон текст ошибки используется дефолтный
        $error = (empty($item['error_msg'])) ? $default_error_msg : $item['error_msg'];
        $answer['errors'][$field] = str_ireplace(FLD_LBL_PATTERN, $item['label'], $error);
    }

    $body .= "{$item['label']}: {$val}" . str_repeat("\n", --$count > 0 ? 2 : 1);
}

// Если нет ошибок - отправляем письмо
if (empty($answer['errors']))
{
    $headers = 'From: My Site <'.$email.'>' . "\r\n" . 'Reply-To: ' . $email;
    mail($email, $subject, $body, $headers);
}

// Возвращаем ответ в формате JSON
header('Content-Type: application/json; charset=utf-8');
die(json_encode($data));
?>