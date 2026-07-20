package hello.embed;

import hello.spring.HelloConfig;
import org.apache.catalina.Context;
import org.apache.catalina.LifecycleException;
import org.apache.catalina.connector.Connector;
import org.apache.catalina.startup.Tomcat;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

public class EmbedTomcatSpringMain {

    public static void main(String[] args) throws LifecycleException {
        System.out.println("EmbedTomcatSpringMain.main");

        // tomcat configuration
        Tomcat tomcat=new Tomcat();
        Connector connector=new Connector();
        connector.setPort(8080);
        tomcat.setConnector(connector);

        // spring container create
        AnnotationConfigWebApplicationContext appContext = new AnnotationConfigWebApplicationContext();
        appContext.register(HelloConfig.class);

        // spring mvc dispatcher servlet create, spring container connect
        DispatcherServlet dispatcher = new DispatcherServlet(appContext);

        // dispatcher servlet register
        Context context = tomcat.addContext("","/");
        tomcat.addServlet("","dispatcher",dispatcher);
        context.addServletMappingDecoded("/","dispatcher");

        tomcat.start();

    }

}
