<%@ page import="com.idmworks.security.google.api.*" %>
<%
	GoogleOAuthPrincipal principal = (GoogleOAuthPrincipal)request.getUserPrincipal();
%>

{
	"n":"<%=principal.getGoogleUserInfo().getName()%>",
	"i":"<%=principal.getGoogleUserInfo().getPicture()%>",
	"e":"<%=principal.getGoogleUserInfo().getEmail()%>"
}