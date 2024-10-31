<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>   

<c:set var="nowpage" value="1" />
<c:if test="${ !empty requestScope.currentPage }">
	<c:set var="nowpage" value="${ requestScope.currentPage }" />
</c:if>
 
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>first</title>
<style type="text/css">
fieldset#ss {
	width: 650px;
	position: relative;
	left: 450px;
}
form fieldset {
	width: 600px;
}
form.sform {
	background: lightgray;
	width: 650px;
	position: relative;
	left: 450px;
	display: none;  /* 안 보이게 함 */
}
</style>
<script type="text/javascript" src="/first/resources/js/jquery-3.7.1.min.js"></script>
<script type="text/javascript">
$(function(){
	//input 태그의 name이 item인 radio 값이 바뀌면(change) 작동되는 이벤트 핸들러 작성
	//jQuery('태그선택자').실행할메소드명(.....); => jQuery 는 줄여서  $로 표시함
	$('input[name=item]').on('change', function(){
		//3개의 item 중에 체크표시가 된 radio 를 선택 => 반복 처리 : each() 메소드 사용
		$('input[name=item]').each(function(index){
			//선택된 radio 순번대로 하나씩 checked 인지 확인함 : is() 메소드 사용
			if($(this).is(':checked')){
				//체크 표시된 아이템에 대한 폼이 보여지게 처리함
				$('form.sform').eq(index).css('display', 'block');
			}else{
				//체크 표시 안된 아이템에 대한 폼이 안 보여지게 처리함
				$('form.sform').eq(index).css('display', 'none');
			}
		});  //each
		
	});  //onchange
}); //document.ready

function changeLogin(element){
	//radio 의 체크 상태가 변경된(change) input 태그의 name 속성값에서 회원아이디를 분리 추출함
	var userid = element.name.substring(8);  //loginok_ 제외한 뒷글자 모두가 회원아이디임
	console.log('userid : ' + userid);
	
	if(element.checked == true && element.value == 'false'){
		//체크 표시된 radio 의 값이 false 이면 (로그인 제한이 체크되었다면)
		console.log('로그인 제한을 체크함');
		location.href = "${ pageContext.servletContext.contextPath }/loginok.do?userId=" + userid + "&loginOk=N";
	}else{
		console.log('로그인 가능을 체크함');
		location.href = "${ pageContext.servletContext.contextPath }/loginok.do?userId=" + userid + "&loginOk=Y";
	}
}
</script>
</head>
<body>
<c:import url="/WEB-INF/views/common/menubar.jsp" />
<hr>
<h1 align="center">공지사항</h1>
<br>
<center>
	<button onclick="javascript:location.href='${ pageContext.servletContext.contextPath }/mlist.do?page=1';">목록</button>
</center>
<br>

<%-- 항목별 검색 기능 추라 --%>
<fieldset id="ss">
	<legend>검색할 항목을 선택하세요.</legend>
	<input type="radio" name="item" id="uid"> 회원 아이디 &nbsp;
	<input type="radio" name="item" id="ugen"> 성별 &nbsp;
	<input type="radio" name="item" id="uage"> 연령대 &nbsp;
	<input type="radio" name="item" id="uenroll"> 가입날짜 &nbsp;
	<input type="radio" name="item" id="ulogok"> 로그인제한여부 &nbsp;
</fieldset>

<%-- 검색 항목별 값 입력 전송용 폼 만들기 --%>
<%-- 회원 아이디 검색 폼 --%>
<form action="msearch.do" id="idform" class="sform" method="get">
	<input type="hidden" name="action" value="id">
	<fieldset>
	<legend>검색할 아이디를 입력하세요.</legend>
		<input type="search" name="keyword" size="50"> &nbsp;
		<input type="submit" value="검색">
	</fieldset>
</form>

<%-- 성별 검색 폼 --%>
<form action="msearch.do" id="genderform" class="sform" method="get">
	<input type="hidden" name="action" value="gender">
	<fieldset>
	<legend>검색할 성별을 선택하세요.</legend>
		<input type="radio" name="keyword" value="M"> 남자 &nbsp;
		<input type="radio" name="keyword" value="F"> 여자 &nbsp;
		<input type="submit" value="검색">
	</fieldset>
</form>

<%-- 연령대로 검색 폼 --%>
<form action="msearch.do" id="ageform" class="sform" method="get">
	<input type="hidden" name="action" value="age">
	<fieldset>
	<legend>검색할 연령대를 선택하세요.</legend>
		<input type="radio" name="keyword" value="20"> 20대 &nbsp;
		<input type="radio" name="keyword" value="30"> 30대 &nbsp;
		<input type="radio" name="keyword" value="40"> 40대 &nbsp;
		<input type="radio" name="keyword" value="50"> 50대 &nbsp;
		<input type="radio" name="keyword" value="60"> 60대 이상 &nbsp;
		<input type="submit" value="검색">
	</fieldset>
</form>

<%-- 가입날짜 검색 폼 --%>
<form action="msearch.do" id="enrollform" class="sform" method="get">
	<input type="hidden" name="action" value="enrolldate">
	<fieldset>
	<legend>검색할 가입날짜를 선택하세요.</legend>
		<input type="date" name="begin"> ~ <input type="date" name="end"> &nbsp;
		<input type="submit" value="검색">
	</fieldset>
</form>

<%-- 로그인 제한 회원 / 로그인 허용 회원 검색 폼 --%>
<form action="msearch.do" id="lokform" class="sform" method="get">
	<input type="hidden" name="action" value="loginok">
	<fieldset>
	<legend>검색할 로그인 제한 또는 가능을 선택하세요.</legend>
		<input type="radio" name="keyword" value="Y"> 로그인 가능 회원 &nbsp;
		<input type="radio" name="keyword" value="N"> 로그인 제한 회원 &nbsp;
		<input type="submit" value="검색">
	</fieldset>
</form>

<br><br>
<%-- 조회된 회원 목록 출력 --%>
<table align="center" border="1" cellspacing="0" cellpadding="0">
	<tr>
		<th>아이디</th>
		<th>이름</th>
		<th>성별</th>
		<th>나이</th>
		<th>전화번호</th>
		<th>이메일</th>
		<th>가입날짜</th>
		<th>마지막 수정날짜</th>
		<th>가입방식</th>
		<th>로그인 제한여부</th>
	</tr>
	<c:forEach items="${ requestScope.list }" var="m">
		<tr>
			<td align="center">${ m.userId }</td>
			<td align="center">${ m.userName }</a></td>
			<td align="center">${ m.gender eq "M"? "남자" : "여자" }</td>
			<td align="center">${ m.age }</td>
			<td align="center">${ m.phone }</td>
			<td align="center">${ m.email }</td>
			<td align="center">${ m.enrollDate }</td>
			<td align="center">${ m.lastModified }</td>
			<td align="center">${ m.signType }</td>
			<td align="center">
				<%-- 관리자가 회원의 로그인 제한을 설정할 수 있도록 함 --%>
				<c:if test="${ m.loginOk eq 'Y' }">
					<input type="radio" name="loginok_${ m.userId }" value="true" checked onchange="changeLogin(this);"> 가능 &nbsp;
					<input type="radio" name="loginok_${ m.userId }"" value="false"  onchange="changeLogin(this);"> 제한
				</c:if>
				<c:if test="${ m.loginOk eq 'N' }">
					<input type="radio" name="loginok_${ m.userId }" value="true" onchange="changeLogin(this);"> 가능 &nbsp;
					<input type="radio" name="loginok_${ m.userId }"" value="false"  onchange="changeLogin(this);" checked> 제한
				</c:if>
			</td>
		</tr>
	</c:forEach>
</table>
<br>

<%-- 페이징 출력 뷰 포함 처리 --%>
<c:import url="/WEB-INF/views/common/pagingView.jsp" />

<hr>
<c:import url="/WEB-INF/views/common/footer.jsp" />
</body>
</html>