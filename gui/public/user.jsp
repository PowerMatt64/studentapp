<%@ page import="com.idmworks.security.google.api.*" %>
<%
	GoogleOAuthPrincipal principal = (GoogleOAuthPrincipal)request.getUserPrincipal();
	System.out.println(  principal.getGoogleUserInfo().getGivenName());
%>

{
	"n":"<%=principal.getGoogleUserInfo().getName()%>",
	"i":"<%=principal.getGoogleUserInfo().getPicture()%>",
	"e":"<%=principal.getGoogleUserInfo().getEmail()%>"
}