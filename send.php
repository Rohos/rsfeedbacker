<?
// �������� ��� ���������� ������� POST ����� ������������� ������
if (strtoupper($_SERVER['REQUEST_METHOD']) != 'POST')
{
    die('������!!!');
}

// ������� �������� ���� � ������ ������
define('FLD_LBL_PATTERN', '{{%field%}}');

// ������ ��� ������
$data = array('errors' => array());

// ��������� ������
$subject = '������ �������� �����';

// E-mail ��� ��������� ������
$email = 'Test@test.ru';

// ��������� ����� ������
$default_error_msg = '������������ �������� ���� "'. FLD_LBL_PATTERN .'"';

/**
 * ������� ��� ����� �����
 * required - ����������� �� ���� (boolean) true ��� false �����������
 * rule - ������� ��������� �������� (integer) ��������� php �����������
 * label - �������� ���� ����� �����������
 * error_msg - ����� ������ FLD_LBL_PATTERN - ���� ����������� ���������� label
 */
$fields = array(
    'name' => array(
        'required' => true,
        'rule' => FILTER_SANITIZE_STRING,
        'label' => '���',
        'error_msg' => '�� �� ��������� ���� "'. FLD_LBL_PATTERN .'"'
    ),
    'email' => array(
        'required' => true,
        'rule' => FILTER_SANITIZE_EMAIL,
        'label' => 'E-mail',
        'error_msg' => '������������ �������� ���� "'. FLD_LBL_PATTERN .'"'
    ),
    'email' => array(
        'required' => false,
        'rule' => FILTER_SANITIZE_STRING,
        'label' => '�������',
        'error_msg' => '�� �� ��������� ���� "'. FLD_LBL_PATTERN .'"'
    )
);

$body = '';
$count = count($fields);
// ��������� ������ ����� � ��������� ������
foreach ($fields as $field => $item)
{
    $val = filter_input(INPUT_POST, $field, $item['rule']);

    // ���� ���� ������������ � �� ��������� ��� �������� ���������� - ��������� ������
    if ( ! empty($item['required']) && empty($val))
    {
        // ���� �� ����� ����� ������ ������������ ���������
        $error = (empty($item['error_msg'])) ? $default_error_msg : $item['error_msg'];
        $answer['errors'][$field] = str_ireplace(FLD_LBL_PATTERN, $item['label'], $error);
    }

    $body .= "{$item['label']}: {$val}" . str_repeat("\n", --$count > 0 ? 2 : 1);
}

// ���� ��� ������ - ���������� ������
if (empty($answer['errors']))
{
    $headers = 'From: My Site <'.$email.'>' . "\r\n" . 'Reply-To: ' . $email;
    mail($email, $subject, $body, $headers);
}

// ���������� ����� � ������� JSON
header('Content-Type: application/json; charset=utf-8');
die(json_encode($data));
?>