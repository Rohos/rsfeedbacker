# rsfeedbacker
������� Jquery ������ ��� �������� ������ html �����. �������� ���������� ��� ������������ � ���������� ������� ��������, ������� ����������� ��������� �� �������. �� ������ ������ � ������� ������������ 2 ���� ��������� - "default" � "bootstrap". 

### ������
0.0.1

### ��������� (default)
* ���������� Jquery ��������� ������
* ���������� ���� ������� "jquery.rsfeedbacker.js"
* ������ ������ �� �����

```
$('form.form_for_send').rsFeedbacker();
```
 
### ��������� (bootstrap)
* ���������� bootstrap.css
* ���������� Jquery ��������� ������
* ���������� bootstrap.js
* ���������� ���� ������� "jquery.rsfeedbacker.js"
* ������ ������ �� �����

```
$('form.form_for_send').rsFeedbacker({'type': 'bootstrap'});
```
 
### ���������
- boxCls - ����� ���������� ����� (string, �� �����. "form_box")
- bootstrapBoxCls - ����� ��������� ��� ����� ����� (string, �� �����. "form-group")
- errorBoxCls - ����� ���������� ������ (string, �� �����. "errors_box")
- errorCls - ����� ������ (string, �� �����. "has-error")
- type - ��� ��������� ������� (string, �� �����. "defaul", ��� ���� "bootstrap")
- need
- successMsg - ����� ��������� ��� �������� �������� (string, �� �����. "�������, ��������� ������� ����������")
- errorMsgs - ����� ��������� ������ (object, �� �����. {'default': '���� {{%field%}} ����������� ��� ����������'})
    
### �������������
������ �������� �� �����. ��� ���� "default" ����� ������ ���� ������� � ������������ ��������� � ������� ��������� � ��������� "boxCls":
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
### ���������
�� ������ ������ ������������ ������� ���������, ����������� ������ �� ������������ �������� ��� ���. ��� ����� ������������ ��������� html:
- ������������ ���� ������� ����� ����������� �� �������
```
<input type="text" name="name" required="required">
```
- �� ������������ ����, ��� ����� �� ���������
```
<input type="text" name="phone">
```
����� ������ �������� � ��������� "errorMsgs" �� ������� ��� ������:
```
{'default': '���� {{%field%}} ����������� ��� ����������'}
```
������� "{{%field%}}" - ����� ������� �� �������� ���� ����� ������� ����������� � �������� ���� "data-rsfeedbacker-label" ��� ������ ������� ���� �� �����:
```
<input type="text" name="name" required="required" data-rsfeedbacker-label="���� ���">
```
��� �� ����� ������������� �������� �������� ������ �������� �� ��������� ������������ ������� �� ��������, � ����� ��������� ������ � ��������� "needTrimVal" - �������� false:
```
$('form.form_for_send').rsFeedbacker({'needTrimVal': false});
```