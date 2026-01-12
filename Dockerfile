FROM httpd:2.4

# Enable rewrite (SPA support)
RUN sed -i 's/#LoadModule rewrite_module/LoadModule rewrite_module/' /usr/local/apache2/conf/httpd.conf

# Copy static build files
COPY . /usr/local/apache2/htdocs/

# SPA fallback
RUN echo '<Directory "/usr/local/apache2/htdocs">\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' >> /usr/local/apache2/conf/httpd.conf

EXPOSE 80
CMD ["httpd-foreground"]

