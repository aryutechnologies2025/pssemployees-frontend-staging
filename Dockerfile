FROM httpd:2.4

# Enable rewrite
RUN sed -i 's/#LoadModule rewrite_module/LoadModule rewrite_module/' /usr/local/apache2/conf/httpd.conf \
 && echo '<Directory "/usr/local/apache2/htdocs">\n    AllowOverride All\n    Require all granted\n</Directory>' >> /usr/local/apache2/conf/httpd.conf

# Copy full static site (NOT dist)
COPY . /usr/local/apache2/htdocs/

# Copy SPA fallback
COPY .htaccess /usr/local/apache2/htdocs/.htaccess

EXPOSE 80
CMD ["httpd-foreground"]
