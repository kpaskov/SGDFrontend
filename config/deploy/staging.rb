set :stage, :dev

server ENV['STAGING_SERVER_A'], user: fetch(:user), port: 22, roles: %w{app}
server ENV['STAGING_SERVER_B'], user: fetch(:user), port: 22, roles: %w{app}
