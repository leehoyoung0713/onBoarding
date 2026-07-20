package hello.boot;

import org.apache.catalina.Context;
import org.apache.catalina.LifecycleException;
import org.apache.catalina.connector.Connector;
import org.apache.catalina.startup.Tomcat;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import java.util.List;

public class MySpringApplication {

    public static void run(Class configClass, String[] args){

        System.out.println("MySpringApplication.run args="+ List.of(args));

        // tomcat configuration
        Tomcat tomcat=new Tomcat();
        Connector connector=new Connector();
        connector.setPort(8080);
        tomcat.setConnector(connector);

        // spring container create
        AnnotationConfigWebApplicationContext appContext = new AnnotationConfigWebApplicationContext();
        appContext.register(configClass);

        // spring mvc dispatcher servlet create, spring container connect
        DispatcherServlet dispatcher = new DispatcherServlet(appContext);

        // dispatcher servlet register
        Context context = tomcat.addContext("","/");
        tomcat.addServlet("","dispatcher",dispatcher);
        context.addServletMappingDecoded("/","dispatcher");

        try {
            tomcat.start();
        } catch (LifecycleException e) {
            throw new RuntimeException(e);
        }
    }
}
